import FallingText from './FallingText';
  export default function FallingTextIndex()
  {


    return <FallingText
    text={`React Bits is a library of animated and interactive React components designed to streamline UI development and simplify your workflow.`}
    highlightWords={["React", "Bits", "animated", "components", "simplify"]}
    highlightClass="highlighted"
    trigger="hover"
    backgroundColor="transparent"
    wireframes={false}
    gravity={0.56}
    fontSize="2rem"
    mouseConstraintStiffness={0.9}
  />

  }
