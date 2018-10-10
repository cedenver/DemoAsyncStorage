import React, { Component } from "react";
import {StyleSheet,Text,TextInput,View,ScrollView,TouchableOpacity,AsyncStorage} from "react-native";
import Note from "./Note";

export default class Main extends Component {
  
    // Constructor kullanımı
   constructor(props) {
      super(props);
      // Sadece constructor içersinde this.state diyerek state'e ilk değeri verebiliyoruz
      this.state = {noteArray: [], newNote: ''};
   }

  componentDidMount()
  {
     this.loadNotes();
  }

  loadNotes = async() => {
      try{
        let storageArrayString = await AsyncStorage.getItem('noteArray')
        
        if(storageArrayString)
        {
            this.state.noteArray = JSON.parse(storageArrayString)
            this.setState({noteArray : this.state.noteArray})
        }
      }catch(error)
      {
          alert(error)
      }
  }

  newTextChanged = (newNoteEntered) => {
     this.setState({ newNote : newNoteEntered })
  }

  render() {
    // Array üzerinde map methodunu kullanarak array içindeki her elemanı kullanarak
    // bir fonksiyon çalıştırıp yeni bir array döndürebiliriz.
    let notes = this.state.noteArray.map(
        (val,key)=>{
            return <Note key={key} keyval={key} val={val} deleteMethod = {()=>this.deleteNote(key)}/>
        }
    );

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.headerText}>Noter App</Text>
            <TouchableOpacity style={{justifyContent: 'center', flex:1}}>
                <Text style={{fontSize:20, color:'white'}}>Next ></Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.scrollViewContainer} >
            {notes}
        </ScrollView>

        <View style={styles.footer}>
          <TextInput
            style={styles.textInput}
            onChangeText={this.newTextChanged}
            value={this.state.newNote}
            placeholder="Enter your note..."
            placeholderTextColor="white"
            underlineColorAndroid="transparent"
          />
        </View>

        <TouchableOpacity
          onPress={this.addNote.bind(this)}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }

  deleteNote(key)
  {
    this.state.noteArray.splice(key,1)
    this.setState({noteArray : this.state.noteArray})

    AsyncStorage.setItem('noteArray' , JSON.stringify(this.state.noteArray))
  }

  addNote() {
    if(this.state.newNote)
    {
        var d = new Date();
        this.state.noteArray.push({
            'date' : d.getDate() + "." + (d.getMonth()+1) + "." + d.getFullYear(),
            'note' : this.state.newNote 
        });

        this.setState({noteArray : this.state.noteArray})
        this.setState({newNote : ''})

        AsyncStorage.setItem('noteArray' , JSON.stringify(this.state.noteArray))
    }
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#E91E63",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 10,
    borderBottomColor: "#ddd"
  },
  headerText: {
    color: "white",
    padding: 26,
    fontSize: 18,
    flex:4
  },
  scrollViewContainer: {
    flex: 1,
    marginBottom: 100
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10
  },
  textInput: {
    alignSelf: "stretch",
    color: "#fff",
    padding: 20,
    backgroundColor: "#252525",
    borderTopWidth: 2,
    borderTopColor: "#ededed"
  },
  addButton: {
    position: "absolute",
    zIndex: 11,
    right: 20,
    bottom: 90,
    backgroundColor: "#E91E63",
    width: 90,
    height: 90,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8
  },
  addButtonText: {
    color: "#fff",
    fontSize: 24
  }
});
