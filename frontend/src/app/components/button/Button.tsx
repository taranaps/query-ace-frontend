type ButtonProps = {
    text: string;
    onClick?: () => void;
    type?: 'button' | 'submit';
  };
  
  export default function Button({ text, onClick, type = 'button' }: ButtonProps) {
    return (
      <button
        type={type}
        onClick={onClick}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        {text}
      </button>
    );
  }
  