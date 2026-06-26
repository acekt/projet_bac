"use client";

import React, { useState, useOptimistic, useTransition } from 'react';
import { Trash2, Edit2, Loader2, Package as PackageIcon, Store as StoreIcon } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Product as ProductType } from '@/types';
import { ProductCreateSheet } from '@/components/blocks/admin/ProductCreateSheet';
import { ProductEditSheet } from '@/components/blocks/admin/ProductEditSheet';
import { DataTable } from '@/components/common/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { deleteProductAction } from '@/actions/ecommerce';
import { useToast } from '@/context/ToastContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AdminProductsClientProps {
  initialProducts: ProductType[];
}

export default function AdminProductsClient({ initialProducts }: AdminProductsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const toast = useToast();
  const [isPending, startTransition] = useTransition();

  // Drawers / Dialogs States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProductToEdit, setSelectedProductToEdit] = useState<ProductType | null>(null);

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductType | null>(null);

  const isCreateOpen = searchParams.get('new') === 'product';

  // Optimistic UI State
  const [optimisticProducts, setOptimisticProducts] = useOptimistic(
    initialProducts,
    (state, action: { type: 'delete'; id: string }) => {
      switch (action.type) {
        case 'delete':
          return state.filter(p => p.id !== action.id);
        default:
          return state;
      }
    }
  );

  const setIsCreateOpen = (open: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (open) {
      params.set('new', 'product');
    } else {
      params.delete('new');
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleDeleteConfirm = () => {
    if (!productToDelete) return;
    const product = productToDelete;
    setIsDeleteAlertOpen(false);
    setProductToDelete(null);

    startTransition(async () => {
      // Apply optimistic deletion
      setOptimisticProducts({ type: 'delete', id: product.id });
      try {
        const res = await deleteProductAction(product.id);
        if (res.success) {
          toast.success(`Le produit ${product.name} a été supprimé.`);
          router.refresh();
        } else {
          toast.error(res.error || "Erreur lors de la suppression.");
        }
      } catch (err: any) {
        toast.error("Une erreur est survenue lors de la suppression.");
      }
    });
  };

  const handleSuccess = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  // Define Columns for products
  const columns: ColumnDef<ProductType>[] = [
    {
      accessorKey: 'name',
      header: 'Produit',
      cell: ({ row }) => {
        const product = row.original;
        let imageUrl = '';
        try {
          if (product.images) {
            const parsed = JSON.parse(product.images);
            if (Array.isArray(parsed) && parsed.length > 0) {
              imageUrl = parsed[0];
            } else {
              imageUrl = product.images;
            }
          }
        } catch (e) {
          imageUrl = product.images || '';
        }

        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 overflow-hidden flex-shrink-0 border border-slate-200/50 dark:border-slate-800">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <PackageIcon size={20} />
              )}
            </div>
            <div>
              <span className="font-bold text-slate-850 dark:text-slate-200 block leading-tight">{product.name}</span>
              {product.description && (
                <span className="text-xs text-slate-450 dark:text-slate-400 font-medium line-clamp-1 mt-0.5 max-w-[200px]">
                  {product.description}
                </span>
              )}
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: 'category',
      header: 'Catégorie',
      cell: ({ row }) => (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-350">
          {row.original.category}
        </span>
      )
    },
    {
      accessorKey: 'store.name',
      header: 'Magasin',
      cell: ({ row }) => {
        const product = row.original;
        return (
          <span className="text-slate-600 dark:text-slate-400 font-bold flex items-center gap-1.5 flex-wrap">
            <StoreIcon size={14} className="text-slate-400 flex-shrink-0" /> 
            {product.store?.name || 'Magasin inconnu'}
          </span>
        );
      }
    },
    {
      accessorKey: 'price',
      header: 'Prix',
      cell: ({ row }) => (
        <span className="font-extrabold text-slate-850 dark:text-emerald-400">{row.original.price.toLocaleString('fr-FR')} CFA</span>
      )
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
      cell: ({ row }) => {
        const prod = row.original;
        const inStock = prod.stock > 0;
        const statusClasses = inStock 
          ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/50' 
          : 'bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/50';
        return (
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusClasses}`}>
            {prod.stock} {prod.unit || 'Pièce'}
          </span>
        );
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex gap-1">
            <button 
              onClick={() => { setSelectedProductToEdit(product); setIsEditOpen(true); }}
              className="p-2 text-slate-400 hover:text-brand-primary transition-colors cursor-pointer"
              title="Modifier"
            >
              <Edit2 size={16} />
            </button>
            <button 
              onClick={() => { setProductToDelete(product); setIsDeleteAlertOpen(true); }}
              className="p-2 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
              title="Supprimer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
      <DataTable 
        columns={columns} 
        data={optimisticProducts} 
        searchPlaceholder="Rechercher un produit par nom, catégorie, magasin..." 
      />

      {/* Slide-out creation Drawer (Sheet) */}
      <ProductCreateSheet 
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleSuccess}
      />

      {/* Slide-out edit Drawer (Sheet) */}
      <ProductEditSheet 
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setSelectedProductToEdit(null); }}
        onSuccess={handleSuccess}
        product={selectedProductToEdit}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-w-md w-full">
          <AlertDialogHeader className="space-y-3">
            <AlertDialogTitle className="text-xl font-black text-slate-800 dark:text-white">
              Supprimer le produit ?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">
              Êtes-vous sûr de vouloir supprimer <strong className="text-slate-700 dark:text-slate-200">{productToDelete?.name}</strong> ? 
              Cette action le retirera du catalogue actif des magasins partenaires.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex justify-end gap-3">
            <AlertDialogCancel 
              onClick={() => { setIsDeleteAlertOpen(false); setProductToDelete(null); }}
              className="h-11 px-5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer"
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              disabled={isPending}
              className="h-11 px-5 rounded-xl font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/10 cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> Suppression...
                </>
              ) : (
                'Supprimer'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
