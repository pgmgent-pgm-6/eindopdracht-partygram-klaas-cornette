import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Variables, DefaultNavigatorOptions } from "@style";
import { Stack } from "expo-router";
import AppContainer from "@shared/App/AppContainer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "@shared/Auth/AuthProvider";

const queryClient = new QueryClient();

const AppTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: Variables.colors.red,
    background: Variables.colors.background,
    text: Variables.colors.headerText,
    card: Variables.colors.primary,
  },
};

export default function Root() {
  return (
    <ThemeProvider value={AppTheme}>
      <QueryClientProvider client={queryClient}>
        <AppContainer>
          <AuthProvider>
            <Stack
              screenOptions={{
                ...DefaultNavigatorOptions.screenOptions,
              }}
            >
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
            </Stack>
          </AuthProvider>
        </AppContainer>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
