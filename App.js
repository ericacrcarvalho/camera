import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Modal } from 'react-native';
import { Camera } from 'expo-camera';

const App = () => {

  const [typeCamera, setTypeCamera] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      //console.log(status);
      setHasPermission(status === 'granted');
    })()
  },[]);

  if (hasPermission == null) {
    return <View/>
  }

  if (hasPermission == false) {
    return <Text style={{fontSize:30}}>Acesso negado</Text>
  }

  const takePhoto = async () => {
    if (cameraRef) {
      let data = await cameraRef.current.takePictureAsync();
      //console.log(data);
      setPhoto(data.uri);
      setOpenModal(true);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.viewText}>
        <Text style={styles.text}>App Camera!</Text>
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
              style={{width: 200, height: 200}}
              source={{uri:photo}}
            />
            <TouchableOpacity
            onPress={() => setOpenModal(false)}
        >
            <Text>Voltar</Text>
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
    flex: 1,
    margin: 20,
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
