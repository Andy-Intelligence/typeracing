import Game from "@/components/Game";
import Image from "next/image";

export default function Home() {
  return (
   <Game/>
  );
}



// "use client"
// import { useState } from "react";
// import type { NextPage } from "next";

// const Home: NextPage = () => {
//   const [userInput, setUserInput] = useState<string>("");
//   const [position, setPosition] = useState<number>(0);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { value } = e.target;
//     const newLength = value.length;
//     const oldLength = userInput.length;

//     // Update the position based on the difference in input length
//     setPosition(position + (newLength - oldLength) * 10); // Move 10px per character

//     // Update the user input
//     setUserInput(value);
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen space-y-4">
//       <div className="relative w-full h-20">
//         <div
//           className="bg-blue-500 text-white p-4 rounded absolute"
//           style={{ left: `${position}px` }}
//         >
//           🚗
//         </div>
//       </div>
//       <input
//         type="text"
//         className="border p-2 text-black"
//         value={userInput}
//         onChange={handleInputChange}
//       />
//     </div>
//   );
// };

// export default Home;
