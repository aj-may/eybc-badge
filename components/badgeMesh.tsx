import { Suspense } from "react";
import { Euler, Mesh } from "three";
import { useGLTF, useTexture, Text } from "@react-three/drei";
import { Badge } from "@prisma/client";

const BadgeMesh = ({ handle, tokenId }: Badge) => {
  const gltf = useGLTF('/models/badge.gltf');
  const texture = useTexture('/img/user.png');
  const creditCard = gltf.scene.getObjectByName('credit_card') as Mesh;

  return <Suspense fallback={null}>
    <mesh geometry={creditCard.geometry} material={creditCard.material} rotation={creditCard.rotation}>
      <mesh position={[-1.5,-0.051,0]} rotation={new Euler(Math.PI/2, 0, Math.PI/2)}>
        <circleGeometry args={[1.5, 30]} />
        <meshBasicMaterial color="#999" map={texture} />
      </mesh>

      <Text color="#000" fontSize={0.8} position={[2.7,-0.051,0]} rotation={new Euler(Math.PI/2, 0, Math.PI/2)}>
        {handle}
      </Text>

      <Text color="#888" fontSize={0.25} position={[3.3,-0.051,0]} rotation={new Euler(Math.PI/2, 0, Math.PI/2)}>
        #{tokenId.toString().padStart(5, '0')}
      </Text>
    </mesh>
  </Suspense>;
}

export default BadgeMesh;