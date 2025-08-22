import React, { useState } from 'react';
import {
  Image as NativeImage,
  ImageProps as NativeImageProps,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';

type ImageProps = NativeImageProps & {
  placeholder?: boolean;
};

export const Image: React.FC<ImageProps> = ({
  source,
  style,
  placeholder,
  ...props
}) => {

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(false);

  const handleLoadStart = () => setLoading(true);

  const handleLoadEnd = () => setLoading(false);

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  // INFO: Fallback placeholder when image fails or source missing
  if (error || !source) {
    return <View style={[styles.placeholder, style]} />;
  }

  return (
    <View style={style}>
      {loading && !placeholder && (
        <ActivityIndicator style={styles.absoluteFill} />
      )}
      <NativeImage
        source={source}
        style={styles.image}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
});
