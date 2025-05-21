import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Define Razorpay interface for TypeScript
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: () => void) => void;
}

interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance;
}

interface RazorpayWindow extends Window {
  Razorpay: RazorpayConstructor;
}

declare const window: RazorpayWindow;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutor: {
    id: number;
    name: string;
  };
}

const PaymentModal = ({ isOpen, onClose, tutor }: PaymentModalProps) => {
  const { user, hasActiveSubscription, getAssignedTutors } = useAuth();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<"new" | "additional">("new");
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [hasThisTutor, setHasThisTutor] = useState(false);
  const [assignedTutorCount, setAssignedTutorCount] = useState(0);

  const basePrice = 3999;
  const additionalTutorPrice = 3999;
  const finalPrice = (plan === "new" ? basePrice : additionalTutorPrice) - 
    ((plan === "new" ? basePrice : additionalTutorPrice) * discount / 100);

  const RAZORPAY_KEY_ID = "rzp_test_52SseWITb2EXYA";
  const BACKEND_URL = "https://supabase-backend-production-42f1.up.railway.app"; // Replace with your Railway URL

  useEffect(() => {
    console.log("Loading Razorpay script...");
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay script loaded successfully");
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      setLoading(false);
      toast({
        title: "Error",
        description: "Failed to load payment gateway. Please try again.",
        variant: "destructive",
      });
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      console.log("Checking subscription status...");
      if (!user) {
        console.log("No user found, skipping subscription check");
        return;
      }

      try {
        console.log("Fetching subscription status...");
        const hasSubscription = await hasActiveSubscription();
        console.log("Has active subscription:", hasSubscription);
        setIsSubscribed(hasSubscription);

        console.log("Fetching assigned tutors...");
        const assignedTutors = await getAssignedTutors();
        console.log("Assigned tutors:", assignedTutors);
        setHasThisTutor(assignedTutors.some(assignment => assignment.tutor_id === tutor.id));
        setAssignedTutorCount(assignedTutors.length);

        setPlan(hasSubscription ? "additional" : "new");
      } catch (error) {
        console.error("Error checking subscription status:", error);
        toast({
          title: "Error",
          description: "Failed to load subscription status. Please try again.",
          variant: "destructive",
        });
      }
    };

    checkSubscriptionStatus();
  }, [user, tutor.id, hasActiveSubscription, getAssignedTutors]);

  const handleApplyCoupon = () => {
    console.log("Applying coupon:", couponCode);
    const code = couponCode.toLowerCase();
    if (code === "first10") {
      setDiscount(10);
      toast({
        title: "Coupon applied!",
        description: "10% discount has been applied to your order.",
      });
    } else if (code === "welcome20") {
      setDiscount(20);
      toast({
        title: "Coupon applied!",
        description: "20% discount has been applied to your order.",
      });
    } else {
      setDiscount(0);
      toast({
        title: "Invalid coupon",
        description: "The coupon code entered is invalid or expired.",
        variant: "destructive",
      });
    }
  };

  const invokeWithRetry = async (url: string, body: any, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`Attempt ${i + 1} to call ${url}...`);
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log(`${url} call successful`);
        return data;
      } catch (error) {
        console.error(`Attempt ${i + 1} failed for ${url}:`, error);
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retrying
      }
    }
  };

  const handlePayment = async () => {
    console.log("Initiating payment process...");
    if (!user) {
      console.log("User not authenticated");
      toast({
        title: "Authentication required",
        description: "Please log in to continue with payment",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (hasThisTutor) {
      console.log("Tutor already assigned:", tutor.name);
      toast({
        title: "Tutor already assigned",
        description: `${tutor.name} is already assigned to your account.`,
        variant: "destructive",
      });
      onClose();
      navigate(`/chat/${tutor.id}`);
      return;
    }

    setLoading(true);

    try {
      console.log("Verifying Supabase session...");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No active session found. Please log in again.");
      }
      console.log("Supabase session verified:", !!session);

      console.log("Creating Razorpay order with amount:", finalPrice * 100);
      const order = await invokeWithRetry(`${BACKEND_URL}/create-order`, {
        amount: finalPrice * 100, // Amount in paise
      });

      console.log("Order creation response:", order);
      if (!order?.id) {
        throw new Error("Failed to create payment order");
      }

      const options: RazorpayOptions = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Tutor Platform",
        description: plan === "new" ? "New Subscription" : "Additional Tutor",
        order_id: order.id,
        handler: async (response) => {
          console.log("Payment successful, verifying:", response);
          try {
            const verification = await invokeWithRetry(`${BACKEND_URL}/verify-payment`, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });

            console.log("Verification response:", verification);
            if (!verification?.verified) {
              throw new Error("Payment verification failed");
            }

            let subscriptionId: string;
            if (!isSubscribed) {
              console.log("Creating new subscription...");
              const endDate = new Date();
              endDate.setDate(endDate.getDate() + 30);

              const { data: subscription, error: subscriptionError } = await supabase
                .from('subscriptions')
                .insert({
                  user_id: user.id,
                  end_date: endDate.toISOString(),
                  status: 'active',
                })
                .select()
                .single();

              console.log("Subscription creation response:", { subscription, subscriptionError });
              if (subscriptionError) throw new Error(`Subscription creation failed: ${subscriptionError.message}`);
              subscriptionId = subscription.id;
            } else {
              console.log("Fetching existing subscription...");
              const { data: subscription, error: subscriptionError } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', user.id)
                .eq('status', 'active')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

              console.log("Existing subscription response:", { subscription, subscriptionError });
              if (subscriptionError) throw new Error(`Subscription fetch failed: ${subscriptionError.message}`);
              subscriptionId = subscription.id;
            }

            console.log("Recording payment...");
            const { error: paymentError } = await supabase
              .from('payments')
              .insert({
                user_id: user.id,
                amount: finalPrice,
                tutor_id: tutor.id,
                type: isSubscribed ? 'additional_tutor' : 'subscription',
                status: 'completed',
                subscription_id: subscriptionId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
              });

            console.log("Payment recording response:", { paymentError });
            if (paymentError) throw new Error(`Payment recording failed: ${paymentError.message}`);

            console.log("Inserting student-tutor assignment...");
            const { error: assignmentError } = await supabase
              .from('student_tutor_assignments')
              .insert({
                student_id: user.id,
                tutor_id: tutor.id,
                subscription_id: subscriptionId,
                status: 'active',
              });

            console.log("Assignment response:", { assignmentError });
            if (assignmentError) {
              console.log("Rolling back payment due to assignment failure...");
              await supabase
                .from('payments')
                .delete()
                .eq('razorpay_payment_id', response.razorpay_payment_id);
              throw new Error(`Assignment creation failed: ${assignmentError.message}`);
            }

            console.log("Payment flow completed successfully");
            toast({
              title: "Payment successful!",
              description: isSubscribed 
                ? "You have successfully added a new tutor to your subscription." 
                : "Your subscription has been activated successfully.",
            });

            onClose();
            console.log("Redirecting to chat:", `/chat/${tutor.id}`);
            navigate(`/chat/${tutor.id}`);
          } catch (error) {
            console.error("Payment processing error:", error);
            toast({
              title: "Processing failed",
              description: error.message || "Payment was successful, but there was an error. Contact support.",
              variant: "destructive",
            });
          } finally {
            console.log("Payment process completed, setting loading to false");
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#2563eb",
        },
        modal: {
          ondismiss: () => {
            console.log("Razorpay modal dismissed");
            setLoading(false);
            toast({
              title: "Payment cancelled",
              description: "The payment process was cancelled.",
              variant: "destructive",
            });
          },
        },
      };

      console.log("Opening Razorpay checkout...");
      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on("payment.failed", () => {
        console.log("Payment failed in Razorpay checkout");
        setLoading(false);
        toast({
          title: "Payment failed",
          description: "The payment attempt failed. Please try again.",
          variant: "destructive",
        });
      });
    } catch (error) {
      console.error("Payment initiation error:", error);
      setLoading(false);
      toast({
        title: "Payment error",
        description: error.message || "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book Sessions with {tutor.name}</DialogTitle>
        </DialogHeader>
        
        {hasThisTutor ? (
          <div className="py-6">
            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-4">
              <AlertCircle className="h-10 w-10 text-yellow-500" />
              <div>
                <h3 className="font-medium">Tutor Already Assigned</h3>
                <p className="text-sm text-gray-600">
                  {tutor.name} is already assigned to your account. You can access your chat directly.
                </p>
              </div>
            </div>
            
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                onClose();
                navigate(`/chat/${tutor.id}`);
              }}
            >
              Go to Chat Room
            </Button>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Choose a Plan</h3>
              <RadioGroup value={plan} onValueChange={setPlan as (value: string) => void} className="space-y-4">
                {!isSubscribed && (
                  <div>
                    <RadioGroupItem value="new" id="new" className="peer sr-only" />
                    <Label
                      htmlFor="new"
                      className="flex flex-col items-start p-4 border-2 rounded-md peer-data-[state=checked]:border-blue-600 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="font-medium">New Subscription</div>
                        <div className="font-bold">₹{basePrice}</div>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">Base subscription for one tutor (30 days)</div>
                    </Label>
                  </div>
                )}
                
                {isSubscribed && (
                  <div>
                    <RadioGroupItem value="additional" id="additional" className="peer sr-only" />
                    <Label
                      htmlFor="additional"
                      className="flex flex-col items-start p-4 border-2 rounded-md peer-data-[state=checked]:border-blue-600 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="font-medium">Additional Tutor</div>
                        <div className="font-bold">₹{additionalTutorPrice}</div>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Add another tutor to your active subscription
                      </div>
                      {assignedTutorCount > 0 && (
                        <div className="text-xs text-blue-600 mt-1">
                          You currently have {assignedTutorCount} tutor{assignedTutorCount !== 1 ? 's' : ''} assigned
                        </div>
                      )}
                    </Label>
                  </div>
                )}
              </RadioGroup>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Have a coupon?</h3>
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter coupon code" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button 
                  variant="outline" 
                  onClick={handleApplyCoupon}
                  disabled={!couponCode || loading}
                >
                  Apply
                </Button>
              </div>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Plan</span>
                    <span>
                      {plan === "new" ? "New Subscription" : "Additional Tutor"}
                    </span>
                  </div>
                  {discount > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span>Base price</span>
                        <span>₹{plan === "new" ? basePrice : additionalTutorPrice}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({discount}%)</span>
                        <span>-₹{((plan === "new" ? basePrice : additionalTutorPrice) * discount / 100).toFixed(0)}</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t">
                <div className="flex justify-between w-full font-bold">
                  <span>Total</span>
                  <span>₹{finalPrice.toFixed(0)}</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}
        
        {!hasThisTutor && (
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? "Processing..." : "Proceed to Payment"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;