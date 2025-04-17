import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="bg-zinc-900 text-gray-200 flex items-center justify-between">
      <div>
        <Heading level="h2" className="txt-xlarge text-gray-200">
          Vous avez déjà un compte ?
        </Heading>
        <Text className="txt-medium text-gray-400 mt-2">
          Connectez-vous pour une meilleure expérience.
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button
            variant="secondary"
            className="h-10"
            data-testid="sign-in-button"
          >
            Connexion
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
