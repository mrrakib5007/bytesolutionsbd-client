import Image from "next/image";
import Link from "next/link";
import CurrentYear from "./CurrentYear";
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import { FaFacebookF, FaWhatsapp, FaYoutube } from "react-icons/fa6";

export default function Footer() {
  const categories = [
    { name: "Software & Utilities", href: "/category/software-utilities" },
    { name: "Productivity Tools", href: "/category/productivity-tools" },
    { name: "Developer Tools", href: "/category/developer-tools" },
    { name: "WordPress Themes & Plugins", href: "/category/wordpress" },
    { name: "Website Templates", href: "/category/templates" },
    { name: "Design Resources", href: "/category/design" },
  ];

  const company = [
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms and Conditions", href: "/terms" },
    { name: "Refund Policy", href: "/refund-policy" },
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
    { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
    { icon: FaWhatsapp, href: "https://whatsapp.com", label: "WhatsApp" },
  ];

  return (
    <footer className="w-full border-t border-gray-100 bg-[#fafafa]">
      <div className="mx-auto max-w-[95%] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                <Image
                  src="/logo.png"
                  alt="Soft License Hub Logo"
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-xl font-black tracking-tight text-black [text-shadow:0_0_1px_rgba(0,0,0,0.5)]">
                Soft{" "}
                <span className="gradient-text [text-shadow:0_0_1px_var(--primary)]">
                  License
                </span>{" "}
                Hub
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-gray-600">
              Smart Digital Solutions. Trusted Software. Genuine licenses, tools
              and creative assets for Bangladesh and the world.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all duration-200 hover:border-(--primary) hover:bg-(--primary) hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold tracking-tight text-black">
              Categories
            </h3>
            <ul className="mt-4 space-y-2.5">
              {categories.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 transition-colors duration-150 hover:text-(--primary)"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold tracking-tight text-black">
              Company & Support
            </h3>
            <ul className="mt-4 space-y-2.5">
              {company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 transition-colors duration-150 hover:text-(--primary)"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold tracking-tight text-black">
              Contact with Us
            </h3>

            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <FiPhone className="mt-1 h-5 w-5 shrink-0 text-(--primary)" />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500">
                    Call Us:
                  </span>
                  <a
                    href="tel:+8801234567890"
                    className="text-base font-bold text-gray-900 transition-colors hover:text-(--primary)"
                  >
                    01991-465007
                  </a>
                  <span className="text-xs text-gray-500">(9AM-10PM)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FiMail className="mt-1 h-5 w-5 shrink-0 text-(--primary)" />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500">
                    Email:
                  </span>
                  <a
                    href="mailto:mr8218101@gmail.com"
                    className="text-sm font-semibold text-gray-900 transition-colors hover:text-(--primary)"
                  >
                    mr8218101@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200/60 py-6">
        <p className="text-center text-xs text-gray-500">
          © <CurrentYear /> SoftLicenseHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
