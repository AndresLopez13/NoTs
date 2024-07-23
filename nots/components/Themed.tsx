/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  Text as DefaultText,
  View as DefaultView,
  TextInput as DefaultTextInput,
  Button as DefaultButton,
  TouchableOpacity as DefaultTouchableOpacity,
} from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "./useColorScheme";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type TextInput = ThemeProps & DefaultTextInput["props"];
export type Button = ThemeProps & DefaultButton["props"];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TextInput(props: TextInput) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const placeholderTextColor = useThemeColor(
    { light: "#6b7280", dark: "#9ca3af" },
    "text"
  );
  const primary = useThemeColor({}, "primaryColor");
  return (
    <DefaultTextInput
      style={[{ color }, style]}
      placeholderTextColor={placeholderTextColor}
      cursorColor={primary}
      {...otherProps}
    />
  );
}

export function Button(props: DefaultButton["props"]) {
  const color = useThemeColor({}, "primaryColor");
  return <DefaultButton color={color} {...props} />;
}

export function TouchableOpacity(props: DefaultTouchableOpacity["props"]) {
  const color = useThemeColor({}, "primaryColor");
  return <DefaultTouchableOpacity {...props} />;
}
