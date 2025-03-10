import logoGobCauca from '../assets/logo-gobernacion-cauca.svg';

export default function Footer() {
  return (
    <footer className='bg-primary w-full py-2 2xl:py-4 rounded-t-badge'>
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="w-auto">
                <ul className="menu menu-horizontal gap-5 2xl:gap-10">
                    <li>
                        <a href="#" target="_blank" className="tooltip aspect-square w-8 2xl:w-10 p-0" data-tip="Facebook">
                            <svg className="size-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 35 34"><path fill="#fff" d="M0 17.094C.012 25.418 6.154 32.528 14.573 34V21.72H10.2V17h4.373v-3.78c-.278-3.39 2.326-6.345 5.815-6.615.327-.024.666-.024.994 0 1.308.035 2.604.153 3.888.376v4.345h-2.229c-2.132 0-2.629 1.035-2.629 2.366V17h4.664l-.775 4.72h-3.889V34c9.595-1.636 16.003-10.513 14.32-19.825C33.253 6.028 26.008.059 17.491 0 7.815.059 0 7.688 0 17.094Z"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#" target="_blank" className="tooltip aspect-square w-8 2xl:w-10 p-0" data-tip="X">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 35 31"><path fill="#fff" d="M21.585 13.104 33.44.983h-4.502l-9.305 9.515L12.507.983H.192l12.465 16.645L.192 30.373h4.502l9.916-10.138 7.593 10.138h12.314L21.585 13.105v-.001ZM6.538 4.099h4.293l17.341 23.155H23.88L6.538 4.1Z"/></svg>
                        </a>
                    </li>
                    <li>
                        <a href="#" target="_blank" className="tooltip aspect-square w-8 2xl:w-10 p-0" data-tip="Instagram">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 35 34"><path fill="#fff" d="M26.715.481H8.96C4.386.481.675 4.028.675 8.401v16.972c0 4.373 3.71 7.92 8.285 7.92h17.755c4.575 0 8.285-3.547 8.285-7.92V8.4c0-4.373-3.71-7.92-8.285-7.92Zm5.326 24.326c0 3.124-2.652 5.658-5.92 5.658H9.552c-3.267 0-5.918-2.534-5.918-5.657V8.968c0-3.123 2.651-5.658 5.919-5.658h16.57c3.267 0 5.919 2.535 5.919 5.658v15.84Z"/><path fill="#fff" d="M17.853 8.401c-4.899 0-8.876 3.802-8.876 8.485s3.977 8.485 8.876 8.485c4.9 0 8.877-3.802 8.877-8.485s-3.977-8.485-8.877-8.485Zm0 14.143c-3.26 0-5.918-2.541-5.918-5.658 0-3.117 2.658-5.658 5.918-5.658 3.261 0 5.92 2.541 5.92 5.658 0 3.117-2.659 5.658-5.92 5.658ZM27.323 9.533c-.979 0-1.776-.762-1.776-1.697s.797-1.697 1.776-1.697c.978 0 1.775.762 1.775 1.697s-.797 1.697-1.775 1.697Z"/></svg>
                        </a>
                    </li>
                </ul>
            </div>
            <div className="max-w-48 2xl:max-w-96">
                <img className='size-full' src={logoGobCauca} alt="Logo Gobernación del Cauca, oficina asesora de planeación" />
            </div>
        </div>
    </footer>
  )
}
