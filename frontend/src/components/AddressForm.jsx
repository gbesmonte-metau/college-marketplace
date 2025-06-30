import {
  useJsApiLoader,
  StandaloneSearchBox,
} from "@react-google-maps/api"
import { useState, useRef } from "react"

const libraries = ["places"]
export default function AddressForm({setLocation}) {
    const [address, setAddress] = useState("")
    const inputref = useRef(null)
    const { isLoaded } = useJsApiLoader({
      id: "google-map-script",
      googleMapsApiKey: import.meta.env.GOOGLE_API_KEY,
      libraries: libraries,
    })

    const handleOnPlacesChanged = () => {
      const address = inputref.current.getPlaces()
      const lat = address[0].geometry.location.lat();
      const lng = address[0].geometry.location.lng();
      if (lat && lng) {
        setLocation(JSON.stringify({lat, lng}));
      }
      setAddress(address)
    }

    return (
      <>
          <div>
            {isLoaded && (
              <StandaloneSearchBox
                onLoad={(ref) => (inputref.current = ref)}
                onPlacesChanged={handleOnPlacesChanged}
                options={{
                  types: ['address'],
                }}
              >
                <input
                  type="text"
                  placeholder="Start typing your address"
                />
              </StandaloneSearchBox>
            )}
          </div>
          <p>{address && address[0].formatted_address}</p>
      </>
    )
}
