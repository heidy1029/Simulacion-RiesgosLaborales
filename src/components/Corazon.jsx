
export default function Corazon({lost}) {
    return (
        <div className="w-6 h-6">
            <svg className={`size-full ${lost ? 'fill-neutral-content':'fill-success'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path d="M13.619 23.298c-.912.938-2.315.938-3.227-.014l-.132-.136C3.963 16.688-.152 12.458.004 7.182.076 4.87 1.12 2.652 2.811 1.347 5.978-1.1 9.888.042 12 2.843c2.11-2.801 6.021-3.957 9.188-1.496 1.692 1.306 2.735 3.523 2.807 5.835.168 5.277-3.958 9.506-10.256 15.993l-.12.123Z" /></svg>
        </div>
    )
}
