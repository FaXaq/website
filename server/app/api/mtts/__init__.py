from fastapi import APIRouter, UploadFile, Depends, File
from app.core.auth import get_current_user
from typing import Annotated
from huggingface_hub import hf_hub_download
import torch
import yaml
from bs_roformer import BSRoformer

router = APIRouter(
    prefix="/mtts",
    tags=["mtts"]
)

checkpoint_path = hf_hub_download(
    repo_id="anvuew/BS-RoFormer",
    filename="bs_roformer_anvuew_sdr_12.45.ckpt"  # replace with actual filename
)

config_path = hf_hub_download(
    repo_id="anvuew/BS-RoFormer",
    filename="config.yaml"
)

with open(config_path, 'r') as f:
    config = yaml.full_load(f)

model = BSRoformer(
    dim=config['model']['dim'],
    depth=config['model']['depth'],
    stereo=config['model']['stereo'],
    num_stems=config['model']['num_stems'],
    time_transformer_depth=config['model']['time_transformer_depth'],
    freq_transformer_depth=config['model']['freq_transformer_depth'],
    freqs_per_bands=config['model']['freqs_per_bands'],
    dim_head=config['model']['dim_head'],
    heads=config['model']['heads'],
    attn_dropout=config['model']['attn_dropout'],
    ff_dropout=config['model']['ff_dropout'],
    flash_attn=config['model']['flash_attn'],
    dim_freqs_in=config['model']['dim_freqs_in'],
    stft_n_fft=config['model']['stft_n_fft'],
    stft_hop_length=config['model']['stft_hop_length'],
    stft_win_length=config['model']['stft_win_length'],
    stft_normalized=config['model']['stft_normalized'],
    mask_estimator_depth=config['model']['mask_estimator_depth'],
)

checkpoint = torch.load(checkpoint_path, map_location='cpu')

    # It might be the state_dict directly
model.load_state_dict(checkpoint, strict=False)
model.eval()

@router.post("/split")
async def split_song(file: Annotated[UploadFile, File(description="A file read as UploadFile")], current_user = Depends(get_current_user)):
    output = model(file)
    print(output)
    return