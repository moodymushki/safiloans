import logging
from html import escape

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.defaultfilters import floatformat
from django.utils import timezone
from django.utils.html import strip_tags

from .models import LoanApplication

logger = logging.getLogger(__name__)


def _money(value) -> str:
    return f"Ksh {floatformat(value, 0)}"


def send_application_received_email(application: LoanApplication) -> None:
    """Send a branded confirmation email without blocking application submission."""
    if not application.email:
        return

    applicant_name = escape(application.full_name)
    submitted_at = timezone.localtime(application.submitted_at).strftime("%d %b %Y, %I:%M %p")
    transaction_code = escape(application.payment_receipt or "Pending review")

    subject = "Safi Loans application received"
    html_body = f"""
    <!doctype html>
    <html>
      <body style="margin:0;padding:0;background:#f3f7fc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f7fc;padding:28px 12px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #dbeafe;">
                <tr>
                  <td style="background:#1268b3;padding:28px 30px;color:#ffffff;">
                    <table role="presentation" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="width:48px;height:48px;border-radius:14px;background:#ffffff;color:#1268b3;font-weight:800;font-size:18px;text-align:center;vertical-align:middle;">SL</td>
                        <td style="padding-left:12px;">
                          <div style="font-size:22px;font-weight:800;letter-spacing:-0.02em;">Safi Loans</div>
                          <div style="font-size:13px;opacity:0.86;">Fast, affordable loans for everyone</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:32px 30px;">
                    <h1 style="margin:0 0 14px;font-size:26px;line-height:1.25;color:#1268b3;">Application received</h1>
                    <p style="margin:0 0 18px;font-size:16px;line-height:1.6;">Hi {applicant_name},</p>
                    <p style="margin:0 0 20px;font-size:16px;line-height:1.6;">
                      Thank you for applying with Safi Loans. We have received your loan application and our team will review it together with your payment details. You will be contacted soon with the next update.
                    </p>

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:16px;margin:24px 0;">
                      <tr>
                        <td style="padding:18px 20px;">
                          <div style="font-size:13px;color:#475569;margin-bottom:10px;">Application summary</div>
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;line-height:1.7;">
                            <tr>
                              <td style="color:#64748b;padding:4px 0;">Loan amount</td>
                              <td align="right" style="font-weight:700;color:#0f172a;padding:4px 0;">{_money(application.loan_amount)}</td>
                            </tr>
                            <tr>
                              <td style="color:#64748b;padding:4px 0;">Processing fee</td>
                              <td align="right" style="font-weight:700;color:#0f172a;padding:4px 0;">{_money(application.processing_fee)}</td>
                            </tr>
                            <tr>
                              <td style="color:#64748b;padding:4px 0;">Transaction code</td>
                              <td align="right" style="font-weight:700;color:#0f172a;padding:4px 0;">{transaction_code}</td>
                            </tr>
                            <tr>
                              <td style="color:#64748b;padding:4px 0;">Submitted</td>
                              <td align="right" style="font-weight:700;color:#0f172a;padding:4px 0;">{submitted_at}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#334155;">
                      Please keep your M-Pesa transaction message safely. If any detail needs confirmation, Safi Loans support will contact you using the phone number provided in your application.
                    </p>
                    <p style="margin:0;font-size:15px;line-height:1.6;color:#334155;">Regards,<br><strong>Safi Loans Team</strong></p>
                  </td>
                </tr>
                <tr>
                  <td style="background:#f8fafc;padding:18px 30px;text-align:center;color:#64748b;font-size:12px;">
                    This is an automatic confirmation from Safi Loans.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    """
    text_body = strip_tags(html_body)

    try:
        message = EmailMultiAlternatives(
            subject=subject,
            body=text_body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[application.email],
        )
        message.attach_alternative(html_body, "text/html")
        message.send(fail_silently=False)
    except Exception:
        logger.exception("Failed to send application confirmation email to %s", application.email)
