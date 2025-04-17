import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center mx-auto"
      data-testid="login-page"
    >
      <h1 className="text-large-semi uppercase mb-6 text-gray-200">
        Bienvenue
      </h1>
      <p className="text-center text-base-regular text-gray-300 mb-8">
        Connectez vous pour bénéficier de la fidélité
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label="Mot de passe"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton
          data-testid="sign-in-button"
          className="w-full mt-6 bg-black text-white hover:bg-gray-800"
        >
          Connexion
        </SubmitButton>
      </form>
      <span className="text-center text-gray-400 text-small-regular mt-6">
        Pas de compte?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="underline text-amber-500 hover:text-amber-400"
          data-testid="register-button"
        >
          Créez-en un ici
        </button>
        .
      </span>
    </div>
  )
}

export default Login
