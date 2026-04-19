# Generated migration for ID front and back images

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('loans', '0002_paymenttransaction_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='loanapplication',
            name='id_front_image',
            field=models.ImageField(blank=True, null=True, upload_to='id_documents/'),
        ),
        migrations.AddField(
            model_name='loanapplication',
            name='id_back_image',
            field=models.ImageField(blank=True, null=True, upload_to='id_documents/'),
        ),
    ]
