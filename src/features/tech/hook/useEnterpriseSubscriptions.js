import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/hook/useAuth'
import {
  getEnterpriseSubscriptionList,
  subscribeEnterprise,
  unsubscribeEnterprise,
} from '../api/enterpriseSubscriptionApi'
import { getEnterpriseSubscriptionErrorMessage } from '../utils/enterpriseSubscriptionErrorMessage'
import {
  ABORT_ERROR_NAME,
  LOGIN_REQUIRED_MESSAGE,
} from '../../../shared/utils/constants'
import { API_ERROR_CODE } from '../../../shared/utils/apiErrorCode'

const createSubscriptionMap = (subscriptions) =>
  new Map(
    subscriptions.map(({ enterpriseId, isActive }) => [enterpriseId, isActive]),
  )

export const useEnterpriseSubscriptions = ({
  enterprises,
  enterpriseByCode,
  isEnterpriseCatalogReady,
  refreshEnterprises,
}) => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const sessionKey = currentUser?.id ?? null
  const activeSessionKeyRef = useRef(sessionKey)
  const requestControllerRef = useRef(null)
  const pendingEnterpriseIdsRef = useRef(new Set())
  const [subscriptionByEnterpriseId, setSubscriptionByEnterpriseId] = useState(
    () => new Map(),
  )
  const [isLoadingSubscriptions, setIsLoadingSubscriptions] = useState(false)
  const [subscriptionError, setSubscriptionError] = useState('')
  const [pendingEnterpriseIds, setPendingEnterpriseIds] = useState(
    () => new Set(),
  )

  const refreshSubscriptions = useCallback(async () => {
    const requestSessionKey = sessionKey

    if (
      requestSessionKey == null ||
      activeSessionKeyRef.current !== requestSessionKey
    ) {
      return false
    }

    requestControllerRef.current?.abort()
    const controller = new AbortController()
    requestControllerRef.current = controller
    setIsLoadingSubscriptions(true)
    setSubscriptionError('')

    try {
      const subscriptions = await getEnterpriseSubscriptionList({
        signal: controller.signal,
      })

      if (
        controller.signal.aborted ||
        activeSessionKeyRef.current !== requestSessionKey
      ) {
        return false
      }

      setSubscriptionByEnterpriseId(createSubscriptionMap(subscriptions))
      return true
    } catch (error) {
      if (
        error.name !== ABORT_ERROR_NAME &&
        activeSessionKeyRef.current === requestSessionKey
      ) {
        console.error('기업 구독 목록 조회 실패', error)
        setSubscriptionError(
          getEnterpriseSubscriptionErrorMessage(
            error,
            '구독한 기업을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
          ),
        )
      }

      return false
    } finally {
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null
        setIsLoadingSubscriptions(false)
      }
    }
  }, [sessionKey])

  useEffect(() => {
    let isActive = true

    activeSessionKeyRef.current = sessionKey
    requestControllerRef.current?.abort()
    requestControllerRef.current = null
    pendingEnterpriseIdsRef.current = new Set()

    queueMicrotask(() => {
      if (!isActive) {
        return
      }

      setSubscriptionByEnterpriseId(new Map())
      setPendingEnterpriseIds(new Set())
      setSubscriptionError('')
      setIsLoadingSubscriptions(false)

      if (sessionKey != null) {
        refreshSubscriptions()
      }
    })

    return () => {
      isActive = false
      activeSessionKeyRef.current = null
      requestControllerRef.current?.abort()
      requestControllerRef.current = null
    }
  }, [refreshSubscriptions, sessionKey])

  const toggleSubscription = useCallback(
    async (code) => {
      if (sessionKey == null) {
        alert(LOGIN_REQUIRED_MESSAGE)
        navigate('/users/login')
        return false
      }

      const requestSessionKey = sessionKey
      const enterprise = enterprises.find((item) => item.code === code)
      const enterpriseId = enterprise?.id

      if (!isEnterpriseCatalogReady || enterpriseId == null) {
        alert('기업 정보를 불러온 뒤 다시 시도해주세요.')
        return false
      }

      const wasSubscribed =
        subscriptionByEnterpriseId.get(enterpriseId) === true

      if (!wasSubscribed && enterprise.isActive !== true) {
        alert('현재 구독할 수 없는 기업입니다.')
        return false
      }

      if (pendingEnterpriseIdsRef.current.has(enterpriseId)) {
        return false
      }

      const nextPendingEnterpriseIds = new Set(pendingEnterpriseIdsRef.current)
      nextPendingEnterpriseIds.add(enterpriseId)
      pendingEnterpriseIdsRef.current = nextPendingEnterpriseIds
      setPendingEnterpriseIds(nextPendingEnterpriseIds)
      setSubscriptionError('')

      try {
        if (wasSubscribed) {
          await unsubscribeEnterprise(enterpriseId)
        } else {
          await subscribeEnterprise(enterpriseId)
        }

        if (activeSessionKeyRef.current !== requestSessionKey) {
          return false
        }

        setSubscriptionByEnterpriseId((currentSubscriptions) => {
          const nextSubscriptions = new Map(currentSubscriptions)
          nextSubscriptions.set(enterpriseId, !wasSubscribed)
          return nextSubscriptions
        })
        await refreshSubscriptions()
        return true
      } catch (error) {
        console.error(
          wasSubscribed ? '기업 구독 취소 실패' : '기업 구독 실패',
          error,
        )

        if (
          error?.status === 404 ||
          error?.code === API_ERROR_CODE.ENTERPRISE_INACTIVE
        ) {
          await Promise.all([refreshEnterprises(), refreshSubscriptions()])
        }

        const message = getEnterpriseSubscriptionErrorMessage(
          error,
          wasSubscribed
            ? '기업 구독을 취소하지 못했습니다.'
            : '기업을 구독하지 못했습니다.',
        )

        if (activeSessionKeyRef.current === requestSessionKey) {
          setSubscriptionError(message)
        }

        alert(message)
        return false
      } finally {
        if (activeSessionKeyRef.current === requestSessionKey) {
          const remainingEnterpriseIds = new Set(
            pendingEnterpriseIdsRef.current,
          )
          remainingEnterpriseIds.delete(enterpriseId)
          pendingEnterpriseIdsRef.current = remainingEnterpriseIds
          setPendingEnterpriseIds(remainingEnterpriseIds)
        }
      }
    },
    [
      enterprises,
      isEnterpriseCatalogReady,
      navigate,
      refreshEnterprises,
      refreshSubscriptions,
      sessionKey,
      subscriptionByEnterpriseId,
    ],
  )

  const subscribedEnterprises = useMemo(
    () =>
      enterprises.filter((enterprise) => {
        if (enterprise.id == null) {
          return false
        }

        const hasSubscription = subscriptionByEnterpriseId.has(enterprise.id)
        const isSubscribed =
          subscriptionByEnterpriseId.get(enterprise.id) === true

        return (
          isSubscribed || (hasSubscription && enterprise.isActive === false)
        )
      }),
    [enterprises, subscriptionByEnterpriseId],
  )
  const subscribedCount = useMemo(
    () =>
      Array.from(subscriptionByEnterpriseId.values()).filter(Boolean).length,
    [subscriptionByEnterpriseId],
  )
  const isSubscribed = useCallback(
    (code) => {
      const enterpriseId = enterpriseByCode.get(code)?.id
      return (
        enterpriseId != null &&
        subscriptionByEnterpriseId.get(enterpriseId) === true
      )
    },
    [enterpriseByCode, subscriptionByEnterpriseId],
  )
  const isSubscriptionPending = useCallback(
    (code) => {
      const enterpriseId = enterpriseByCode.get(code)?.id
      return enterpriseId != null && pendingEnterpriseIds.has(enterpriseId)
    },
    [enterpriseByCode, pendingEnterpriseIds],
  )

  return {
    isLoadingSubscriptions,
    isSubscribed,
    isSubscriptionPending,
    refreshSubscriptions,
    subscribedCount,
    subscribedEnterprises,
    subscriptionError,
    toggleSubscription,
  }
}
