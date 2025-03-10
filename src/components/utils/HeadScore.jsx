import React from 'react'

const HeadScore = ({title}) => {
	return (
		<>
			<div className="h-4 w-full bg-gradient-to-r from-azulBrillante1 to-azulBrillante2"></div>
			<div className="bg-clEFEFEF py-4 px-2 w-full">
				<div className="container mx-auto flex justify-between items-center w-full">
					<div className="flex flex-col justify-center items-center w-2/6">
						<i className="fa-solid fa-trophy text-3xl"></i>
						<p className="text-cl379f text-md font-semibold">10 Puntos</p>
					</div>
					<div className="w-3/6">
						<p className="uppercase text-md font-bold text-center">{title}</p>
					</div>
					<div className="flex flex-col justify-center items-center w-2/6">
						<i className="fa-solid fa-trophy text-3xl"></i>
						<p className="text-cl379f text-md font-semibold">100 Puntos</p>
					</div>
				</div>
			</div>
		</>
	)
}

export default HeadScore