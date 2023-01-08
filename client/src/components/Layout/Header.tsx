import { useState } from "react"

const Header = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className="w-full items-center bg-white py-2 px-6 hidden sm:flex">
            <div className="w-1/2"></div>
            <div className="relative w-1/2 flex justify-end">
                {
                    isOpen && (
                        <>
                            <button onClick={() => setIsOpen(false)} className="h-full w-full fixed inset-0 cursor-default"></button>
                            <div className="absolute w-32 bg-white rounded-lg shadow-lg py-2 mt-16">
                                <a href="#" className="block px-4 py-2 account-link hover:text-white">Account</a>
                                <a href="#" className="block px-4 py-2 account-link hover:text-white">Support</a>
                                <a href="#" className="block px-4 py-2 account-link hover:text-white">Sign Out</a>
                            </div>
                        </>
                    )
                }
            </div>
        </header>
    )
}

export default Header
