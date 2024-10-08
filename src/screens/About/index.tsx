import React from "react";

type Props = {};

const About = (props: Props) => {
  return (
    <div className="flex flex-col items-center p-6 bg-white w-full">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
        About TruBarber
      </h1>

      <p className="text-lg text-gray-700 text-justify max-w-4xl mb-8">
        Welcome to TruBarber, the ultimate app for discovering and booking local
        barbers that fit your style! Whether you're looking for a quick trim, a
        full grooming session, or a personalized style consultation, TruBarber
        makes it easy to find barbers who offer exactly what you need. Simply
        browse through available barbers, check their schedules, and book an
        appointment that suits your convenience.
      </p>

      <h2 className="text-3xl font-semibold text-gray-800 mb-4">
        Key Features
      </h2>

      <div className="text-lg text-gray-700 max-w-2xl space-y-6">
        <div>
          <span className="font-semibold text-gray-800">
            Book Appointments:
          </span>
          {' '}TruBarber makes booking appointments a breeze. Browse through
          available barbers, view their profiles, and select an appointment time
          that fits your schedule.
        </div>

        <div>
          <span className="font-semibold text-gray-800">
            Barber Availability:
          </span>
          {' '}Barbers can list their available slots, allowing users to quickly find
          times that work for them. Never miss an opportunity to get the perfect
          cut.
        </div>

        <div>
          <span className="font-semibold text-gray-800">
            Barber Shop Registration: 
          </span>
          {' '}Barbers can register their shop on TruBarber, showcasing their
          services, specialties, and availability. It’s the perfect way to reach
          new clients and grow your business.
        </div>

        <div>
          <span className="font-semibold text-gray-800">In-App Chat:</span> The
          built-in chat feature lets users communicate directly with their
          barber. Discuss styles, ask questions, or confirm details about your
          upcoming appointment in real-time.
        </div>

        <div>
          <span className="font-semibold text-gray-800">Service Listings:</span>
          {' '}Barbers can list their services and pricing, so users can find exactly
          what they’re looking for. From cuts to shaves and beyond, TruBarber
          makes it easy to explore all available options.
        </div>
      </div>

      <p className="text-lg text-gray-800 text-center max-w-4xl mt-8">
        With TruBarber, getting the perfect cut is just a few clicks away.
        Whether you’re booking an appointment or chatting with your barber,
        TruBarber is designed to make your grooming experience smooth, simple,
        and enjoyable. Download now and discover your new favorite barber today!
      </p>
    </div>
  );
};

export default About;
