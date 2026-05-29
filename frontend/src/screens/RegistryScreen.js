import { useState } from "react";
import {
  View,
  TextInput,
  TouchableHighlight,
  Text,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function RegistryScreen() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordsMatch = (password, passwordConfirm) => {
    return password === passwordConfirm;
  };
  const onPress = () => {};

  return (
    <View>
      <Text style={styles.title}>¡Regístrate!</Text>
      <SafeAreaView>
        <TextInput
          style={styles.input}
          onChangeText={setUserName}
          placeholder="Nombre de usuario"
          value={userName}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          placeholder="Contraseña"
          value={password}
          secureTextEntry={true}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          onChangeText={setConfirmPassword}
          placeholder="Confirme contraseña"
          value={confirmPassword}
          secureTextEntry={true}
          autoCapitalize="none"
        />
        <TouchableHighlight
          disabled={!passwordsMatch(password, confirmPassword)}
          style={[
            styles.button,
            !passwordsMatch(password, confirmPassword) && styles.buttonDisabled,
          ]}
          underlayColor="#99d9f4"
          onPress={onPress}
        >
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableHighlight>
        <Text style={styles.statusText}>
          {passwordsMatch(password, confirmPassword)
            ? "Las contraseñas coinciden"
            : "Las contraseñas no coinciden"}
        </Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: 250,
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  button: {
    width: 250,
    height: 40,
    margin: 12,
    borderRadius: 25,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  statusText: {
    textAlign: "center",
    marginTop: 10,
  },
});

export default RegistryScreen;
