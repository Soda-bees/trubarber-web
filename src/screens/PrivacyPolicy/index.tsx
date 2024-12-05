import React from 'react'

type Props = {}

const PrivacyPolicy = (props: Props) => {
  return (
    <div className="p-6 md:p-10 lg:p-20 text-gray-800 w-full">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">Privacy Policy</h1>
      <h3 className="text-xl md:text24xl font-normal text-center mb-6">Your privacy matters to us. We are dedicated to safeguarding your personal information and ensuring transparency in our data practices.</h3>
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-10 rounded-md shadow-md space-y-6">
        <section>
          <p>
            This privacy policy applies to the TruBarber app (hereby referred to as “Application”) for mobile devices that was created by Sodabees (hereby referred to as “Service Provider”) as a Free service. This service is intended for use “AS IS”.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold">Information Collection and Use</h2>
          <p>
            The Application collects information when you download and use it. This information may include information such as:
          </p>
          <ul className="list-disc ml-6 space-y-2 mb-4">
            <li>"App would like to access your location"</li>
            <li>"Track user's location"</li>
          </ul>
          <p>
          The Application also collects your device’s location data to provide features such as personalized content, relevant recommendations, and location-based services. When you grant location permission, truBarber will track your current location to show you nearby barber shops and provide directions to them. Aggregated and anonymized location data also helps the Service Provider analyze user behavior, identify trends, and improve the Application’s performance.          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Third-Party Services</h2>
          <p>
            The Service Provider may periodically transmit anonymized location data to external services. Below are the links to the Privacy Policy of the third-party service providers used by the Application:
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Google Play Services</a></li>
            <li><a href="https://firebase.google.com/policies/analytics" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Google Analytics for Firebase</a></li>
            <li><a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Firebase Crashlytics</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Opt-Out Rights</h2>
          <p>
            You can stop all collection of information by the Application easily by uninstalling it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Data Retention Policy</h2>
          <p>
            The Service Provider will retain User Provided data for as long as you use the Application and for a reasonable time thereafter. To delete User Provided Data, please contact <a href="mailto:brian@simationstudios.com" className="text-blue-500 underline">brian@simationstudios.com</a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Children</h2>
          <p>
            The Application does not knowingly collect personally identifiable information from children under 13 years of age. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Security</h2>
          <p>
            The Service Provider is concerned about safeguarding the confidentiality of your information and has implemented safeguards to protect the information collected.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Changes</h2>
          <p>
            This Privacy Policy may be updated periodically. You are advised to consult this Privacy Policy regularly for any changes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Your Consent</h2>
          <p>
            By using the Application, you consent to the processing of your information as set forth in this Privacy Policy now and as amended by us.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Contact Us</h2>
          <p>
            If you have any questions regarding privacy while using the Application, please contact us via email at <a href="mailto:brian@simationstudios.com" className="text-blue-500 underline">brian@simationstudios.com</a>.
          </p>
        </section>
      </div>
    </div>
  )
}

export default PrivacyPolicy