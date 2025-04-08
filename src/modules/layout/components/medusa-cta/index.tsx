import { Text } from "@medusajs/ui"
import { FaFacebook, FaInstagram } from "react-icons/fa"
import { FaTiktok } from "react-icons/fa6"

const MedusaCTA = () => {
  return (
    <Text className="flex gap-x-4 txt-compact-small-plus items-center">
      <a
        href="https://www.facebook.com/people/La-Bella-Vista/61558146489458/"
        target="_blank"
        rel="noreferrer"
        className="text-gray-500 hover:text-black transition-colors"
        aria-label="Facebook"
      >
        <FaFacebook size={20} />
      </a>
      <a
        href="https://www.instagram.com/labellavista91250/"
        target="_blank"
        rel="noreferrer"
        className="text-gray-500 hover:text-black transition-colors"
        aria-label="Instagram"
      >
        <FaInstagram size={20} />
      </a>
      <a
        href="https://www.tiktok.com/@la.bellavista"
        target="_blank"
        rel="noreferrer"
        className="text-gray-500 hover:text-black transition-colors"
        aria-label="TikTok"
      >
        <FaTiktok size={20} />
      </a>
    </Text>
  )
}

export default MedusaCTA
