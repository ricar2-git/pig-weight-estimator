#!/bin/bash
# Helper script to publish PorciWeight to a new GitHub repository

export PATH="/Users/inparable/.gemini/antigravity/scratch/tools/bin:$PATH"

echo "=================================================="
echo "🐖 PorciWeight - Push to GitHub Repository"
echo "=================================================="

# Check if gh is authenticated
if gh auth status &>/dev/null; then
  echo "✅ GitHub CLI is authenticated!"
  echo "Creating new public GitHub repository 'pig-weight-estimator'..."
  gh repo create pig-weight-estimator --public --source=. --remote=origin --push
  echo "🎉 Repository created and pushed successfully to GitHub!"
else
  echo "GitHub CLI is not logged in yet."
  echo ""
  echo "Option A: Authenticate with GitHub CLI:"
  echo "  gh auth login"
  echo "  gh repo create pig-weight-estimator --public --source=. --remote=origin --push"
  echo ""
  echo "Option B: If you already created a repo on GitHub (e.g., https://github.com/USER/pig-weight-estimator):"
  echo "  git remote add origin https://github.com/YOUR_USERNAME/pig-weight-estimator.git"
  echo "  git push -u origin main"
fi
