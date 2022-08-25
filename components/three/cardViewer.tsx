import { Suspense, useEffect, useRef } from 'react'
import { useFrame, useLoader } from 'react-three-fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Text } from '@react-three/drei';
import * as THREE from 'three'

interface CardViwerProps {
    text?: string,
    profileImgSrc?: string,
}

function CardViewer(props: CardViwerProps) {
    const mesh = useRef<any>();
    const textRef = useRef<any>();
    const gltf = useLoader(GLTFLoader, '/models/card.gltf')
    const {
        text = 'AJ was here',
        profileImgSrc = '/models/defaultProfile.jpg'
    } = props

    console.log(gltf)

    useEffect(() => {
        const texLoader = new THREE.TextureLoader();
        const newTexture = texLoader.load(profileImgSrc);
        console.log(gltf.nodes)
        const profile = gltf.nodes['ProfilePicture'] as THREE.Mesh;

        if(profile){
            console.log(profile)
            if(profile.material){
                profile.material.map = newTexture
            }
        }
    }, [])

    useFrame(() => {
        if (mesh.current) {
            mesh.current.rotation.y += 0.009
        }
    })

    return (
        <Suspense fallback={null}>
            <primitive ref={mesh} object={gltf.scene} scale={[.5, .5, .5]}>
            <Text
                ref={textRef}
                color={'#EC2D2D'}
                fontSize={.5}
                maxWidth={200}
                lineHeight={1}
                letterSpacing={0.02}
                textAlign={'left'}
                font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
                anchorX="center"
                anchorY="middle"
                position={[0, 3.8, .1]}
                // rotation={new THREE.Vector3(0,180,0)}
            >
                {text}
            </Text>
            </primitive>
        </Suspense>
    )
}

export default CardViewer
