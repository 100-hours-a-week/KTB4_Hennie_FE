import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getEnterpriseList } from '../api/enterpriseSubscriptionApi'
import { getEnterpriseSubscriptionErrorMessage } from '../utils/enterpriseSubscriptionErrorMessage'
import { createFallbackEnterpriseList } from '../utils/normalizeEnterprise'

export const useEnterpriseCatalog = () => {
  const requestControllerRef = useRef(null)
  const [enterprises, setEnterprises] = useState(createFallbackEnterpriseList)
  const [isEnterpriseCatalogReady, setIsEnterpriseCatalogReady] =
    useState(false)
  const [isLoadingEnterprises, setIsLoadingEnterprises] = useState(false)
  const [enterpriseError, setEnterpriseError] = useState('')

  const refreshEnterprises = useCallback(async () => {
    requestControllerRef.current?.abort()
    const controller = new AbortController()
    requestControllerRef.current = controller
    setIsLoadingEnterprises(true)
    setEnterpriseError('')

    try {
      const nextEnterprises = await getEnterpriseList({
        signal: controller.signal,
      })

      if (controller.signal.aborted) {
        return false
      }

      setEnterprises(nextEnterprises)
      setIsEnterpriseCatalogReady(true)
      return true
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('기업 목록 조회 실패', error)
        setEnterpriseError(
          getEnterpriseSubscriptionErrorMessage(
            error,
            '기업 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
          ),
        )
      }

      return false
    } finally {
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null
        setIsLoadingEnterprises(false)
      }
    }
  }, [])

  useEffect(() => {
    let isActive = true

    queueMicrotask(() => {
      if (isActive) {
        refreshEnterprises()
      }
    })

    return () => {
      isActive = false
      requestControllerRef.current?.abort()
      requestControllerRef.current = null
    }
  }, [refreshEnterprises])

  const enterpriseByCode = useMemo(
    () =>
      new Map(enterprises.map((enterprise) => [enterprise.code, enterprise])),
    [enterprises],
  )
  const getEnterpriseByCode = useCallback(
    (code) => enterpriseByCode.get(code) ?? null,
    [enterpriseByCode],
  )
  const enterpriseBySlug = useMemo(
    () =>
      new Map(enterprises.map((enterprise) => [enterprise.slug, enterprise])),
    [enterprises],
  )
  const getEnterpriseBySlug = useCallback(
    (slug) => enterpriseBySlug.get(slug) ?? null,
    [enterpriseBySlug],
  )
  const enterpriseById = useMemo(
    () =>
      new Map(
        enterprises
          .filter((enterprise) => enterprise.id != null)
          .map((enterprise) => [String(enterprise.id), enterprise]),
      ),
    [enterprises],
  )
  const getEnterpriseById = useCallback(
    (id) => (id == null ? null : (enterpriseById.get(String(id)) ?? null)),
    [enterpriseById],
  )

  return {
    enterprises,
    enterpriseByCode,
    enterpriseById,
    enterpriseBySlug,
    enterpriseError,
    getEnterpriseByCode,
    getEnterpriseById,
    getEnterpriseBySlug,
    isEnterpriseCatalogReady,
    isLoadingEnterprises,
    refreshEnterprises,
  }
}
