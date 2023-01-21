"use client";
import { Wrapper } from "@googlemaps/react-wrapper";
import { useEffect, useRef } from "react";

function MyMapComponent({
  center,
  zoom,
}: {
  center: google.maps.LatLngLiteral;
  zoom: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      // setMap(new window.google.maps.Map(ref.current, {defaultProps.center, defaultProps.zoom}));
      new window.google.maps.Map(ref.current, {
        center,
        zoom,
        fullscreenControl: false,
        mapTypeControl: false,
        zoomControl: false,
        panControl: false,
        streetViewControl: false,
      });
    }
  }, [ref, center]);

  return <div ref={ref} id="map" style={{ flexGrow: "1", height: "100%" }} />;
}

export default function Map({ lat, lng }: { lat: any; lng: any }) {
  return (
    <div
      // style={{ display: "flex", height: "50vh" }}
      className="mt-4 h-96"
    >
      {lat && lng && (
        <Wrapper
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}
          // render={render}
        >
          <MyMapComponent
            center={{
              lat: parseFloat(lat),
              lng: parseFloat(lng),
            }}
            zoom={18}
          />
        </Wrapper>
      )}
    </div>
  );
}
