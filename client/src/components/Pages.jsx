import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { Context } from "../main";

const Pages = observer(() => {
    const { device } = useContext(Context);
    const pageCount = Math.ceil(device.totalCount / device.limit);
    const pages = [];

    for (let i = 1; i <= pageCount; i++) {
        pages.push(i); 
    }

    return (
        <div className="flex justify-center my-5">
            <nav aria-label="Pagination">
                <ul className="inline-flex -space-x-px">
                    {device.page > 1 && (
                        <li>
                            <button
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100"
                                onClick={() => device.setPage(device.page - 1)}
                            >
                                &laquo; Предыдущая
                            </button>
                        </li>
                    )}
                    
                    {pages.map((page) => (
                        <li key={page}>
                            <button
                                onClick={() => device.setPage(page)}
                                className={`px-3 py-2 text-sm font-medium border border-gray-300 ${
                                    device.page === page
                                        ? "bg-amber-200 text-orange-600"
                                        : "bg-white text-gray-500"
                                }`}
                            >
                                {page}
                            </button>
                        </li>
                    ))}

                    {device.page < pageCount && (
                        <li>
                            <button
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100"
                                onClick={() => device.setPage(device.page + 1)}
                            >
                                Следующая &raquo;
                            </button>
                        </li>
                    )}
                </ul>
            </nav>
        </div>
    );
});

export default Pages;
