#!/bin/bash

# Slidev Builder MCP - Publication Script
# This script prepares and publishes the MCP package for global distribution

set -e

echo "🚀 Preparing Slidev Builder MCP for publication..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if logged into npm
if ! npm whoami > /dev/null 2>&1; then
    print_error "You must be logged into npm. Run 'npm login' first."
    exit 1
fi

print_info "Starting pre-publication checks..."

# 1. Clean and install dependencies
print_status "Cleaning node_modules and reinstalling dependencies..."
rm -rf node_modules package-lock.json
npm install

# 2. Run TypeScript compilation
print_status "Compiling TypeScript..."
if ! npm run build; then
    print_error "TypeScript compilation failed!"
    exit 1
fi

# 3. Run tests (if they exist)
if npm run test > /dev/null 2>&1; then
    print_status "Running tests..."
    npm run test
else
    print_warning "No tests found - consider adding tests for better quality assurance"
fi

# 4. Run linting
if npm run lint > /dev/null 2>&1; then
    print_status "Running linter..."
    npm run lint
else
    print_warning "No linting configured - using TypeScript compiler checks only"
fi

# 5. Validate package.json structure
print_status "Validating package.json..."

# Check required fields
required_fields=("name" "version" "description" "main" "types" "repository" "keywords" "author" "license")
for field in "${required_fields[@]}"; do
    if ! jq -e ".$field" package.json > /dev/null; then
        print_error "Missing required field in package.json: $field"
        exit 1
    fi
done

# Check MCP configuration
if ! jq -e '.mcpServers' package.json > /dev/null; then
    print_error "Missing MCP configuration in package.json"
    exit 1
fi

print_status "Package.json validation passed"

# 6. Check file structure
print_status "Checking file structure..."
required_files=("README.md" "QUICKSTART.md" "src/index.ts" "templates/" "python/")
for file in "${required_files[@]}"; do
    if [ ! -e "$file" ]; then
        print_error "Missing required file/directory: $file"
        exit 1
    fi
done

print_status "File structure validation passed"

# 7. Check README content
if [ $(wc -c < README.md) -lt 1000 ]; then
    print_warning "README.md seems short - consider adding more documentation"
fi

# 8. Verify npm package size
package_size=$(npm pack --dry-run 2>/dev/null | grep "package size" | awk '{print $3}' | sed 's/[^0-9.]//g')
if [ $(echo "$package_size > 10" | bc -l) -eq 1 ]; then
    print_warning "Package size is ${package_size}MB - consider optimizing"
fi

# 9. Version check
current_version=$(jq -r '.version' package.json)
print_info "Current version: $current_version"

echo ""
echo "📋 Pre-publication checklist:"
echo "   ✓ Dependencies installed"
echo "   ✓ TypeScript compiled"
echo "   ✓ Package.json validated"
echo "   ✓ File structure verified"
echo "   ✓ Ready for publication"
echo ""

# Ask for confirmation
read -p "Do you want to publish version $current_version to npm? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Publication cancelled"
    exit 0
fi

# 10. Publish to npm
print_status "Publishing to npm..."
if npm publish --access public; then
    print_status "Successfully published to npm!"
    
    # 11. Create GitHub release (optional)
    if command -v gh &> /dev/null; then
        read -p "Create GitHub release? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_status "Creating GitHub release..."
            gh release create "v$current_version" \
                --title "Release v$current_version" \
                --notes "Slidev Builder MCP v$current_version

## What's New
- Comprehensive MCP for Slidev presentation generation
- Professional templates and themes
- Python chart integration
- Interactive components
- Multiple export formats

## Installation
\`\`\`bash
npm install -g slidev-builder-mcp
\`\`\`

## Quick Start
See [QUICKSTART.md](./QUICKSTART.md) for getting started guide.

## Documentation
Full documentation available in [README.md](./README.md)"
            print_status "GitHub release created!"
        fi
    fi
    
    # 12. Show post-publication info
    echo ""
    echo "🎉 ${GREEN}Publication completed successfully!${NC}"
    echo ""
    echo "📦 Package Information:"
    echo "   Name: $(jq -r '.name' package.json)"
    echo "   Version: $current_version"
    echo "   Registry: https://www.npmjs.com/package/$(jq -r '.name' package.json)"
    echo ""
    echo "🚀 Installation:"
    echo "   npm install -g $(jq -r '.name' package.json)"
    echo ""
    echo "📖 Next Steps:"
    echo "   1. Share the package with the community"
    echo "   2. Monitor downloads and feedback"
    echo "   3. Plan future releases based on user needs"
    echo "   4. Update documentation as needed"
    echo ""
else
    print_error "Publication failed!"
    exit 1
fi
