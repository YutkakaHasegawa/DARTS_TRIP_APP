const TOKYO_23KU_BOUNDS = {
  minLat: 35.48,
  maxLat: 35.84,
  minLng: 139.50,
  maxLng: 139.97,
}

const JR_LINE_PATTERNS = [
  /jr/i,
  /山手線/,
  /中央.*線/,
  /京浜東北線/,
  /総武.*線/,
  /埼京線/,
  /湘南新宿ライン/,
  /常磐線/,
  /横須賀線/,
  /南武線/,
  /横浜線/,
  /武蔵野線/,
  /青梅線/,
  /八高線/,
  /五日市線/,
  /宇都宮線/,
  /高崎線/,
  /上野東京ライン/,
  /京葉線/,
  /成田線/,
]

export const getStationArea = (lat, lng) => {
  if (
    lat >= TOKYO_23KU_BOUNDS.minLat &&
    lat <= TOKYO_23KU_BOUNDS.maxLat &&
    lng >= TOKYO_23KU_BOUNDS.minLng &&
    lng <= TOKYO_23KU_BOUNDS.maxLng
  ) {
    return '23ku'
  }

  return 'tama'
}

export const isJRLineName = (lineName) => {
  if (!lineName) {
    return false
  }

  const normalizedLineName = String(lineName)
  return JR_LINE_PATTERNS.some((pattern) => pattern.test(normalizedLineName))
}

export const isJRStation = (lines) => {
  if (!Array.isArray(lines) || lines.length === 0) {
    return false
  }

  return lines.some(isJRLineName)
}

export const filterStations = (stations, selectedAreas, selectedLineTypes) => {
  const selectedAreaSet = new Set(selectedAreas || [])
  const selectedLineSet = new Set(selectedLineTypes || [])
  const areaFilterActive = selectedAreaSet.size === 1
  const lineFilterActive = selectedLineSet.size === 1

  return stations.filter((station) => {
    const areaMatch = !areaFilterActive || selectedAreaSet.has(station.area)
    const lineMatch = !lineFilterActive ||
      (selectedLineSet.has('JR') && station.isJR) ||
      (selectedLineSet.has('private') && !station.isJR)

    return areaMatch && lineMatch
  })
}
