import { FaFacebook, FaInstagram } from "react-icons/fa"
import { FaTiktok } from "react-icons/fa6"

const MedusaCTA = () => {
  return (
    <div className="flex gap-x-4 items-center">
      <a
        href="https://www.facebook.com/people/La-Bella-Vista/61558146489458/"
        target="_blank"
        rel="noreferrer"
        aria-label="Facebook"
        className="social-icon-link"
      >
        <FaFacebook
          size={20}
          className="text-gray-500 hover:!text-amber-500 transition-colors"
        />
      </a>
      <a
        href="https://www.instagram.com/labellavista91250/"
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram"
        className="social-icon-link"
      >
        <FaInstagram
          size={20}
          className="text-gray-500 hover:!text-amber-500 transition-colors"
        />
      </a>
      <a
        href="https://www.tiktok.com/@la.bellavista"
        target="_blank"
        rel="noreferrer"
        aria-label="TikTok"
        className="social-icon-link"
      >
        <FaTiktok
          size={20}
          className="text-gray-500 hover:!text-amber-500 transition-colors"
        />
      </a>
    </div>
  )
}

export default MedusaCTA
