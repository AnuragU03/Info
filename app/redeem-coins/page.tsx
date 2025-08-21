
'use client';

import { useState } from 'react';
import { kiranaStores, type KiranaStore } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { CircleDollarSign, Send, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function RedeemCoinsPage() {
  const { toast } = useToast();
  const { villageCoins, redeemCoins } = useAuth();
  const [selectedStore, setSelectedStore] = useState<KiranaStore | null>(null);
  const [amount, setAmount] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRedeemClick = (store: KiranaStore) => {
    setIsSuccess(false);
    setAmount('');
    setSelectedStore(store);
  };

  const handleConfirmRedemption = () => {
    const redeemAmount = parseInt(amount);
    if (!redeemAmount || redeemAmount <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Amount',
        description: 'Please enter a valid amount to redeem.',
      });
      return;
    }
    if (redeemAmount > villageCoins) {
        toast({
            variant: 'destructive',
            title: 'Insufficient Balance',
            description: 'You do not have enough VillageCoins for this transaction.',
        });
        return;
    }

    redeemCoins(redeemAmount);
    setIsSuccess(true);
    toast({
      title: 'Redemption Successful!',
      description: `You have successfully redeemed ${amount} VillageCoins at ${selectedStore?.name}.`,
    });
  };

  return (
    <>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-headline font-bold">
              Redeem VillageCoins
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Use your earnings at partnered local stores. Your balance: <span className="font-bold text-accent">{villageCoins.toLocaleString()}</span> coins.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {kiranaStores.map((store) => (
              <Card key={store.id} className="flex flex-col group hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{store.name}</CardTitle>
                  <CardDescription>{store.villageName}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-foreground/80">{store.description}</p>
                </CardContent>
                <CardContent>
                  <Button className="w-full" onClick={() => handleRedeemClick(store)}>
                    <CircleDollarSign className="mr-2 h-5 w-5" />
                    Redeem Coins Here
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!selectedStore} onOpenChange={(isOpen) => !isOpen && setSelectedStore(null)}>
        <DialogContent>
          {selectedStore && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-headline">
                  Redeem at {selectedStore.name}
                </DialogTitle>
                <DialogDescription>
                  Enter the amount of VillageCoins you want to spend.
                </DialogDescription>
              </DialogHeader>
              {isSuccess ? (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                    <h3 className="text-xl font-semibold">Redemption Successful!</h3>
                    <p className="text-muted-foreground mt-2">
                        {amount} VillageCoins have been transferred to {selectedStore.name}.
                    </p>
                </div>
              ) : (
                <div className="py-4 space-y-4">
                  <div className="relative">
                    <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-10 text-lg h-12"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Your current balance is {villageCoins.toLocaleString()} VillageCoins.
                  </p>
                </div>
              )}
              <DialogFooter>
                {isSuccess ? (
                     <Button onClick={() => setSelectedStore(null)} className="w-full">Done</Button>
                ) : (
                    <Button onClick={handleConfirmRedemption} className="w-full" size="lg" disabled={!amount}>
                        <Send className="mr-2 h-4 w-4" />
                        Confirm Redemption
                    </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
