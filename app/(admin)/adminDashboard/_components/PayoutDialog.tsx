import React, { useState } from "react";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PayoutDialogProps {
  open: boolean;
  onClose: () => void;
  payout: {
    user_id: string;
    amount: string;
    amount_in_USD: string;
    paypal_id: string;
  };
  setPayouts: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function PayoutDialog({
  open,
  onClose,
  payout,
  setPayouts,
}: PayoutDialogProps) {
  const [payoutText, setPayoutText] = useState("");
  const [payoutAttachment, setPayoutAttachment] = useState<File | null>(null);
  const [attachmentLink, setAttachmentLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAttachmentUpload = async () => {
    if (!payoutAttachment) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", payoutAttachment);

    try {
      setLoading(true);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/file/upload_and_return_link`, formData);
      setAttachmentLink(response.data.file_url);
      alert("Attachment uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to upload attachment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompletePayout = async () => {
    if (!payoutText || !attachmentLink) {
      alert("Please complete all fields.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/payout/complete_payout`, {
        ...payout,
        payout_text:payoutText,
        payout_attachment:attachmentLink,
      });

      if (response.data.status=="Successful") {
        setPayouts((prev) =>
          prev.map((item) =>
            item.user_id === payout.user_id
              ? { ...item, status: "completed" }
              : item
          )
        );
        alert("Payout completed!");
        onClose();
      }
    } catch (error) {
      console.error(error);
      alert("Failed to complete the payout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Payout</DialogTitle>
          <DialogDescription>
            Finalize the payout details and upload any necessary attachments.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-2">
            <p>
              <strong>User ID:</strong> {payout.user_id}
            </p>
            <p>
              <strong>Amount:</strong> {payout.amount} ({payout.amount_in_USD} USD)
            </p>
            <p>
              <strong>PayPal ID:</strong> {payout.paypal_id}
            </p>
          </div>
          <Textarea
            placeholder="Enter payout notes"
            value={payoutText}
            onChange={(e) => setPayoutText(e.target.value)}
            className="w-full"
          />
          <div className="space-y-2">
            <Input
              type="file"
              onChange={(e) =>
                setPayoutAttachment(e.target.files ? e.target.files[0] : null)
              }
            />
            <Button
              variant="secondary"
              onClick={handleAttachmentUpload}
              disabled={!payoutAttachment || loading}
            >
              {loading ? "Uploading..." : "Upload Attachment"}
            </Button>
            {attachmentLink && (
              <p className="text-sm text-green-600">
                Attachment uploaded:{" "}
                <a
                  href={attachmentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {attachmentLink}
                </a>
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleCompletePayout}
            disabled={loading || !payoutText || !attachmentLink}
          >
            {loading ? "Processing..." : "Complete Payout"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
