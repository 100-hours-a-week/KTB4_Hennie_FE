import { login } from "../../api/authApi";
import { navigate } from "../../route/navigation.js";
import { initPasswordToggles } from "../../utils/initPasswordToggles.js";

export const initLoginPage = () => {
  const form = document.querySelector(".login-form");

  initPasswordToggles(".login-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const loginForm = getLoginFormValues();

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

const getLoginFormValues = () => ({
  email: document.querySelector("#email")?.value.trim() || "",
  password: document.querySelector("#password")?.value || "",
});
