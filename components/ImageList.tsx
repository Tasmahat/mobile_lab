import {Alert, Image, Pressable, StyleSheet, View} from "react-native";
import React, {useEffect, useState} from "react";

export default function ImageList({imageUris, onImageDelete}) {
    return(
        <View style={styles.imageContainer}>
            {imageUris.map((uri, index) =>
                <Pressable key={index} onLongPress={() => onImageDelete(index)}>
                    <Image key={index}
                           style={{width: 400, height: 400}}
                           source={{uri: uri}}
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