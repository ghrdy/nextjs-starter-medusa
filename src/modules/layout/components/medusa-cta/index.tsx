import { Text } from "@medusajs/ui"
import { FaFacebook, FaInstagram, FaTripadvisor } from "react-icons/fa"

const MedusaCTA = () => {
  return (
    <Text className="flex gap-x-4 txt-compact-small-plus items-center">
      <a
        href="https://facebook.com"
        target="_blank"
        rel="noreferrer"
        className="text-gray-500 hover:text-black transition-colors"
        aria-label="Facebook"
      >
        <FaFacebook size={20} />
      </a>
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noreferrer"
        className="text-gray-500 hover:text-black transition-colors"
        aria-label="Instagram"
      >
        <FaInstagram size={20} />
      </a>
      <a
        href="https://tripadvisor.fr"
        target="_blank"
        rel="noreferrer"
        className="text-gray-500 hover:text-black transition-colors"
        aria-label="TripAdvisor"
      >
        <FaTripadvisor size={20} />
      </a>
    </Text>
  )
}

export default MedusaCTA
