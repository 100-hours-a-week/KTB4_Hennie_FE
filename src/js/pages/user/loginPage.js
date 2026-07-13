import { login } from "../../api/authApi";
import { navigate } from "../../route/navigation.js";
import { initPasswordToggles } from "../../utils/initPasswordToggles.js";

export const initLoginPage = () => {
  const form = document.querySelector(".login-form");

  initPasswordToggles(".login-form");

  form.addEventListener("input", (event) => {
    syncLoginSubmitButton(form);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const loginForm = getLoginFormValues(form);

    try {
      await login({
        email: loginForm.email,
        password: loginForm.password,
      });

      await navigate("/posts");
    } catch (error) {
      console.log(error);
    }
  });
};

const getLoginFormValues = (form) => ({
  email: document.querySelector("#email")?.value.trim() || "",
  password: document.querySelector("#password")?.value || "",
});

const syncLoginSubmitButton = (form) => {
  const submitButton = form.querySelector("button[type='submit']");
  const loginForm = getLoginFormValues();
};
