type Props = {
  text: string
  onClick: (event: React.MouseEvent) => void
  disabled?: boolean
}

const Button = (props: Props) => {
 return  <button className='bg-white px-2 rounded-xl' disabled={props.disabled} onClick={props.onClick}>{props.text}</button>
}

export default Button