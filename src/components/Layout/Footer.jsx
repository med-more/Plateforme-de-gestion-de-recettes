import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Youtube, ChefHat } from "lucide-react"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { name: "Facebook", icon: Facebook, url: "#" },
    { name: "Twitter", icon: Twitter, url: "#" },
    { name: "Instagram", icon: Instagram, url: "#" },
    { name: "Youtube", icon: Youtube, url: "#" },
  ]

  const quickLinks = [
    { name: "About Us", url: "#" },
    { name: "Contact", url: "#" },
    { name: "Terms of Service", url: "#" },
    { name: "Privacy Policy", url: "#" },
  ]

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center">
              <ChefHat size={24} className="text-orange-500 mr-2" />
              <span className="text-orange-500 text-3xl font-bold">Globe</span>
              <span className="text-orange-400 text-3xl font-bold">Cooker</span>
            </Link>
            <p className="mt-4 text-gray-300">
              A platform for sharing and discovering delicious cooking recipes from around the world. Join our community
              of food enthusiasts and unleash your culinary creativity.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.url} className="text-gray-300 hover:text-orange-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => {
                const IconComponent = link.icon
                return (
                  <a
                    key={index}
                    href={link.url}
                    className="text-gray-300 hover:text-orange-400 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.name}
                  >
                    <IconComponent size={20} />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {currentYear} GlobeCooker Recipe Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
