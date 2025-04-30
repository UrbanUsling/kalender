
import  CalenderComponent  from "../components/CalenderComponent";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}


export default function Home() {
  return <CalenderComponent />;
}
