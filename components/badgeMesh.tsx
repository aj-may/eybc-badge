import { Suspense } from "react";
import { Euler, Mesh } from "three";
import { useGLTF, useTexture, Text } from "@react-three/drei";

type BadgeProps = {
  handle: string,
  email: string,
};

const BadgeMesh = ({ handle, email}: BadgeProps) => {
  const gltf = useGLTF('/models/badge.gltf');
  const texture = useTexture('/img/user.png');
  const creditCard = gltf.scene.getObjectByName('credit_card') as Mesh;

  return <Suspense fallback={null}>
    <mesh geometry={creditCard.geometry} material={creditCard.material} rotation={creditCard.rotation}>
      <mesh position={[-1.5,-0.051,0]} rotation={new Euler(Math.PI/2, 0, Math.PI/2)}>
        <circleGeometry args={[1.5, 30]} />
        <meshBasicMaterial color="#999" map={texture} />
      </mesh>

      <Text color="#000" fontSize={0.8} position={[2.5,-0.051,0]} rotation={new Euler(Math.PI/2, 0, Math.PI/2)}>
        {handle}
      </Text>

      <Text color="#000" fontSize={0.4} position={[3.3,-0.051,0]} rotation={new Euler(Math.PI/2, 0, Math.PI/2)}>
        {email}
      </Text>
    </mesh>
  </Suspense>;
}

export default BadgeMesh;