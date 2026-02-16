import Link from "next/link";

import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { deleteProduct, getAllProducts } from "@/lib/actions/product.actions";
import { formatCurrency, formatId } from "@/lib/utils";

import { requireAdmin } from "@/app/lib/auth-guard";

const AdminProductsPage = async (props: {
    searchParams: Promise<{ page: string; query: string; category: string }>;
}) => {
    await requireAdmin();
    const searchParams = await props.searchParams;
    const { page = "1", query = "", category = "" } = searchParams;

    const products = await getAllProducts({
        query,
        category,
        page: Number(page),
    });

    return (
        <div className="space-y-2">
            <div className="flex-between">
                <div className="flex items-center gap-3">
                    <h1 className="h2-bold">Products</h1>
                    {query && (
                        <div>
                            Filtered by <i>&quot;{query}&quot;</i>{" "}
                            <Link href={`/admin/products`}>
                                <Button variant="outline" size="sm">
                                    Remove Filter
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                <Button asChild variant="default">
                    <Link href="/admin/products/create">Create Product</Link>
                </Button>
            </div>
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>NAME</TableHead>
                            <TableHead className="text-right">PRICE</TableHead>
                            <TableHead>CATEGORY</TableHead>
                            <TableHead>STOCK</TableHead>
                            <TableHead>RATING</TableHead>
                            <TableHead className="w-[100px]">ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products?.data.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{formatId(product.id)}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell className="text-right">
                                    {formatCurrency(product.price)}
                                </TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>{product.rating}</TableCell>
                                <TableCell className="flex gap-1">
                                    <Button asChild variant="outline" size="sm">
                                        <Link
                                            href={`/admin/products/${product.id}`}
                                        >
                                            Edit
                                        </Link>
                                    </Button>
                                    <DeleteDialog
                                        id={product.id}
                                        action={deleteProduct}
                                        itemsOnPage={products.data.length}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {!!products?.totalPages && products.totalPages > 1 && (
                    <Pagination
                        page={Number(page)}
                        totalPages={products.totalPages}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminProductsPage;
