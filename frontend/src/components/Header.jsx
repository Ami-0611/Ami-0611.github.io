import React from "react";

const Header = () => {
  return (
    <header className="text-white shadow-lg">
      {/* Single section with logo and title */}
      <div className="bg-gradient-to-r from-green-500 to-green-600">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex justify-center items-center bg-white/40 w-28 h-28 rounded-md mx-auto mb-4">
              <img
                src="/GraziosoSalvareLogo.png"
                alt="Logo"
                className="w-28 h-28"
              />
            </div>

            <p className="text-green-100 text-md md:text-base font-bold">
              Grazioso Salvare - Saving Lives, One Paw at a Time
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
