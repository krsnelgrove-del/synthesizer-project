export default function ContentHeader() {
    return(
        <div className="flex flex-row gap-2 p-2 w-full h-full">
            {/*Title*/}
            <div className="flex justify-center items-center w-2/10 h-full">
                TITLE
            </div>

            <div className="flex justify-center items-center h-full w-7/10">
                EMPTY
            </div>

            
            {/*Header Buttons*/}
            <div className="flex justify-center items-center text-nowrap overflow-hidden w-1/10 h-full">
                BUTTONS
            </div>

        </div>
    )
}