import React, { useEffect, useState } from "react";
import { Image, View } from "react-native";
import { fetchImageAsBase64 } from "../api/client";

export default function FiguritaImage({ imagenId, style }) {
  const [uri, setUri] = useState(null);

  useEffect(() => {
    if (!imagenId) return;
    fetchImageAsBase64(imagenId).then(setUri);
  }, [imagenId]);

  if (!uri) return <View style={[style, { backgroundColor: "#334155" }]} />;
  return <Image source={{ uri }} style={style} resizeMode="cover" />;
}