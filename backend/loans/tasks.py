"""Background tasks for processing heavy operations without blocking requests."""

import logging
import os
from threading import Thread

from PIL import Image
from django.core.files.base import ContentFile

from .emails import send_application_received_email as _send_email
from .models import LoanApplication

logger = logging.getLogger(__name__)


def _process_image_merge_sync(application_id: int) -> None:
    """Merge ID images synchronously (called in background thread)."""
    try:
        application = LoanApplication.objects.get(id=application_id)
        
        if not application.id_front_image or not application.id_back_image:
            return
        
        # Open images
        front_img = Image.open(application.id_front_image.path)
        back_img = Image.open(application.id_back_image.path)
        
        # Resize images to same height for side-by-side merging
        front_height = front_img.height
        back_height = back_img.height
        max_height = max(front_height, back_height)
        
        # Resize both to max height, maintaining aspect ratio
        front_img = front_img.resize(
            (int(front_img.width * max_height / front_img.height), max_height),
            Image.Resampling.LANCZOS
        )
        back_img = back_img.resize(
            (int(back_img.width * max_height / back_img.height), max_height),
            Image.Resampling.LANCZOS
        )
        
        # Create new image with combined width
        merged_width = front_img.width + back_img.width
        merged_img = Image.new('RGB', (merged_width, max_height), (255, 255, 255))
        
        # Paste images side by side
        merged_img.paste(front_img, (0, 0))
        merged_img.paste(back_img, (front_img.width, 0))
        
        # Save merged image
        from io import BytesIO
        buffer = BytesIO()
        merged_img.save(buffer, format='JPEG', quality=85)
        buffer.seek(0)
        
        # Generate filename for merged image
        base_name = os.path.splitext(os.path.basename(application.id_front_image.name))[0]
        merged_filename = f"{base_name}_merged.jpg"
        
        application.id_merged_image.save(merged_filename, ContentFile(buffer.getvalue()), save=True)
        logger.info(f"Successfully merged ID images for application {application_id}")
        
    except Exception as e:
        logger.error(f"Error merging ID images for application {application_id}: {e}")


def process_image_merge_async(application_id: int) -> None:
    """Process image merging in background thread."""
    thread = Thread(target=_process_image_merge_sync, args=(application_id,), daemon=True)
    thread.start()


def send_email_async(application_id: int) -> None:
    """Send confirmation email in background thread."""
    def _send():
        try:
            application = LoanApplication.objects.get(id=application_id)
            _send_email(application)
            logger.info(f"Email sent for application {application_id}")
        except Exception as e:
            logger.error(f"Error sending email for application {application_id}: {e}")
    
    thread = Thread(target=_send, daemon=True)
    thread.start()
