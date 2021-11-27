import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Modal } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';

const App = () => {

  // Camera
  const [typeCamera, setTypeCamera] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  // Location
  const [msg, setMsg] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Camera
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      //console.log(status);
      setHasPermission(status === 'granted');
    })();

    // Location
    (async () => {
      let { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== 'granted') {
        setMsg("Permissão negada");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();

  },[]);

  // Exibindo a localização
  let textLocation = "Buscando...";
  if (msg) {
    textLocation = msg;
  } else if (location) {
    //console.log(JSON.stringify(location));
    textLocation = JSON.stringify(location);
  }


  // Permissão da câmera
  if (hasPermission == null) {
    return <View/>
  }
  if (hasPermission == false) {
    return <Text style={{fontSize:30}}>Acesso negado!</Text>
  }

  // Tirando uma foto
  const takePhoto = async () => {
    if (cameraRef) {
      let data = await cameraRef.current.takePictureAsync();
      //console.log(data);
      setPhoto(data.uri);
      setOpenModal(true);
    }
  }

  // Salvando a foto
  const savePhoto = async () => {
    const assets = await MediaLibrary.createAssetAsync(photo)
    .then(() => {
      alert("Foto salva com sucesso!")
    })
    .catch(error => {
      alert("Falha ao salvar a foto");
      console.log("error:", error);
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.viewText}>
        <Text style={styles.text}>App Camera!</Text>
        <Text style={{}}>Minha localização: {textLocation}</Text>
      </View>
      <Camera
        style={styles.camera}
        type={typeCamera}
        ref={cameraRef}
      >
        <TouchableOpacity
          onPress={() => {
            setTypeCamera(
              typeCamera === Camera.Constants.Type.back 
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back)
          }}
        >
          <Text style={styles.textButton}>Trocar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={takePhoto}
        >
          <Text style={styles.textButton}>Tirar foto</Text>
        </TouchableOpacity>

        { photo && 
          <Modal
            animationType="slide"
            transparent={false}
            visible={openModal}
          >
            <Text>My photo!</Text>
            <Image
              style={{width: 220, height: 500}}
              source={{uri:photo}}
            />
            <TouchableOpacity
              onPress={() => setOpenModal(false)}
            >
              <Text>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={savePhoto}
            >
              <Text>Salvar</Text>
            </TouchableOpacity>
          </Modal>       
        }    
      </Camera>         
    </View>
  );
}
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  viewText: {
    flex: 0.1,
    alignItems: 'center',
    marginTop: 30,
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',    
  },
  camera: {
    flex: 0.9,
    margin: 20,
    marginTop: 40,
  },
  viewButton: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  }, 
  button: {
    flex: 0.5,
    alignSelf: 'flex-end',
    alignItems: 'center',
    margin:2,
  },
  textButton: {
    fontSize: 18,
    color: 'white',
  },
  viewModal: {
    flex:1,
    alignItems: 'center',
    margin: 30,
  }
});
