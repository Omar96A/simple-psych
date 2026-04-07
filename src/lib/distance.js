const EARTH_RADIUS_MILES = 3958.8;

function toRadians(value) {
  return (value * Math.PI) / 180;
}

export function getDistanceInMiles(from, to) {
  if (
    !from ||
    typeof from.latitude !== "number" ||
    typeof from.longitude !== "number" ||
    typeof to.latitude !== "number" ||
    typeof to.longitude !== "number"
  ) {
    return null;
  }

  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);

  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) *
      Math.cos(toLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  const arc = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  return Number((EARTH_RADIUS_MILES * arc).toFixed(1));
}
