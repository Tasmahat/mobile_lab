import { Image, Pressable, StyleSheet, View} from "react-native";
import React from "react";

export default function ImageList({imageDatas, onImageDelete}) {
    return(
        <View style={styles.imageContainer}>
            {imageDatas.map(imageData =>
                <Pressable key={imageData.id} onLongPress={() => onImageDelete(imageData.id)}>
                    <Image key={imageData.id}
                           style={{width: 400, height: 400}}
                           source={{uri: imageData.uri}}
                    />
                </Pressable>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    image : {
        width: 400,
        height: 400
    },
    imageContainer: {
        flex: 1,
    },
});