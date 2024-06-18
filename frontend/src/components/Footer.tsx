import Image from 'next/image'

const Footer = () => {
  return <div className="flex flex-col items-center bg-white pt-10 pb-5">
    <Image src='/logo-transparent.png' alt="CDRjobs Logo" width={100} height={20} />
      <a href='https://www.linkedin.com/company/cdrjobs/posts/?feedView=all'>
        <Image src='/linkedin.svg' alt="Linkedin Logo" width={20} height={20} />
      </a>
      <a href='/privacy-policy'>Privacy policy</a>
  </div>
}

export default Footer